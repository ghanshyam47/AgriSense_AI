package com.agrisense.server.repository;

import com.agrisense.server.model.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {
    Page<Alert> findByUserId(String userId, Pageable pageable);
    Page<Alert> findByUserIdAndRead(String userId, boolean read, Pageable pageable);
    long countByUserIdAndRead(String userId, boolean read);
    void deleteByIdAndUserId(String id, String userId);
}
