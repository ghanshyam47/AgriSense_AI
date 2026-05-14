package com.agrisense.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "farm_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String farmName;
    private String location;
    private Double areaHectares;

    @Column(name = "soil_type")
    private String soilType;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "farm_primary_crops", joinColumns = @JoinColumn(name = "farm_id"))
    @Column(name = "crop")
    private List<String> primaryCrops;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
