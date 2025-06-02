// src/main/java/com/planesmadrid/apimadrid/service/PlanService.java
package com.planesmadrid.apimadrid.service;

import com.planesmadrid.apimadrid.model.Dia;
import com.planesmadrid.apimadrid.model.Horario;
import com.planesmadrid.apimadrid.model.Plan;
import com.planesmadrid.apimadrid.repository.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class PlanService {

    private final PlanRepository repo;

    public PlanService(PlanRepository repo) {
        this.repo = repo;
    }

    public List<Plan> findAll() {
        return repo.findAll();
    }

    /**
     * Filtra usando el nuevo método que comprueba diaInicio, horas y precio.
     * Si horaMax = 00:00, lo interpretamos como fin de jornada (23:59:59).
     */
    public List<Plan> filter(
            Dia dia,
            LocalTime horaMin,
            LocalTime horaMax,
            Double precioMin,
            Double precioMax
    ) {
        // Si el cliente envía horaMax = 00:00, lo trato como 23:59:59
        if (horaMax != null && horaMax.equals(LocalTime.MIDNIGHT)) {
            horaMax = LocalTime.of(23, 59, 59);
        }
        return repo.findByOptionalFilters(dia, horaMin, horaMax, precioMin, precioMax);
    }

    /**
     * Guarda un Plan. Cada Horario que viene en plan.getHorarios()
     * se marca con cruzaMedianoche = (horaFin < horaInicio).
     */
    @Transactional
    public Plan save(Plan p) {
        // Asociar cada Horario al Plan y calcular cruzaMedianoche
        for (Horario h : p.getHorarios()) {
            h.setPlan(p);
            boolean cruza = h.getHoraFin().isBefore(h.getHoraInicio());
            h.setCruzaMedianoche(cruza);
        }
        return repo.save(p);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
