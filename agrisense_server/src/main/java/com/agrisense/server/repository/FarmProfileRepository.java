package com.agrisense.server.repository;

import com.agrisense.server.model.FarmProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmProfileRepository extends JpaRepository<FarmProfile, String> {
    Optional<FarmProfile> findByUserId(String userId);
}
