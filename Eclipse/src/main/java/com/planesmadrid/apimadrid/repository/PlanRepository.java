// src/main/java/com/planesmadrid/apimadrid/repository/PlanRepository.java
package com.planesmadrid.apimadrid.repository;

import com.planesmadrid.apimadrid.model.Dia;
import com.planesmadrid.apimadrid.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Long> {

    /**
     * Filtra por día de inicio (diaInicio), horario y precio.
     * - Si un Horario no cruza medianoche (horaFin >= horaInicio),
     *   comprobamos: h.horaInicio <= :horaFin Y h.horaFin >= :horaInicio.
     * - Si cruzaMedianoche = true (h.horaFin < h.horaInicio), 
     *   solo comprobamos que la parte inicial (h.horaInicio → 23:59) 
     *   entre en el rango (h.horaInicio <= :horaFin).
     */
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
        @Param("horaMin")   LocalTime horaMin,   // horaInicio mínima
        @Param("horaMax")   LocalTime horaMax,   // horaFin máxima
        @Param("precioMin") Double precioMin,
        @Param("precioMax") Double precioMax
    );
}
