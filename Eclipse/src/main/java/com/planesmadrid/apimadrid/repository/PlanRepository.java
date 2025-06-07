package com.planesmadrid.apimadrid.repository;

import com.planesmadrid.apimadrid.model.Dia;
import com.planesmadrid.apimadrid.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Long> {

    @Query("""
      SELECT DISTINCT p
        FROM Plan p
        JOIN p.horarios h
       WHERE (:dia       IS NULL OR h.diaInicio      = :dia)
         AND (:horaMin   IS NULL 
              OR (h.cruzaMedianoche = false 
                  AND h.horaFin      >= :horaMin 
                  AND h.horaInicio   <= :horaMax)
              OR (h.cruzaMedianoche = true 
                  AND h.horaInicio  <= :horaMax)
             )
         AND (:precioMin IS NULL OR p.precio >= :precioMin)
         AND (:precioMax IS NULL OR p.precio <= :precioMax)
    """)
    List<Plan> findByOptionalFilters(
        @Param("dia")       Dia dia,
        @Param("horaMin")   LocalTime horaMin,   
        @Param("horaMax")   LocalTime horaMax,  
        @Param("precioMin") Double precioMin,
        @Param("precioMax") Double precioMax
    );
}
