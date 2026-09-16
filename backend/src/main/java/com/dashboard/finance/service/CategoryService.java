package com.dashboard.finance.service;

import com.dashboard.finance.dto.CategoryRequest;
import com.dashboard.finance.dto.CategoryResponse;
import com.dashboard.finance.entity.Category;
import com.dashboard.finance.exception.ResourceNotFoundException;
import com.dashboard.finance.repository.CategoryRepository;
import com.dashboard.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public CategoryResponse create(Long userId, CategoryRequest request) {
        Category category = Category.builder()
                .user(userRepository.getReferenceById(userId))
                .name(request.name())
                .type(request.type())
                .color(request.color())
                .build();
        category = categoryRepository.save(category);
        return toResponse(category);
    }

    public List<CategoryResponse> list(Long userId) {
        return categoryRepository.findAllByUserIdOrderByNameAsc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse update(Long userId, Long categoryId, CategoryRequest request) {
        Category category = findOwned(userId, categoryId);
        category.setName(request.name());
        category.setType(request.type());
        category.setColor(request.color());
        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public void delete(Long userId, Long categoryId) {
        Category category = findOwned(userId, categoryId);
        categoryRepository.delete(category);
    }

    private Category findOwned(Long userId, Long categoryId) {
        return categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getType(), category.getColor());
    }
}
