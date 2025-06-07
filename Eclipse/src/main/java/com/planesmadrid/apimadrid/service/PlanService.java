package com.planesmadrid.apimadrid.service;

import com.planesmadrid.apimadrid.exception.ResourceNotFoundException;
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


    public List<Plan> filter(
            Dia dia,
            LocalTime horaMin,
            LocalTime horaMax,
            Double precioMin,
            Double precioMax
    ) {
        // horaMax = 00:00, lo trato como 23:59:59
        if (horaMax != null && horaMax.equals(LocalTime.MIDNIGHT)) {
            horaMax = LocalTime.of(23, 59, 59);
        }
        return repo.findByOptionalFilters(dia, horaMin, horaMax, precioMin, precioMax);
    }

    @Transactional
    public Plan save(Plan p) {
  
        for (Horario h : p.getHorarios()) {
            h.setPlan(p);
            boolean cruza = h.getHoraFin().isBefore(h.getHoraInicio());
            h.setCruzaMedianoche(cruza);
        }
        return repo.save(p);
    }
    
    @Transactional
    public Plan update(Long id, Plan payload) {
        Plan existente = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Plan con id " + id + " no encontrado"));

        existente.setNombre(payload.getNombre());
        existente.setLocalizacion(payload.getLocalizacion());
        existente.setPrecio(payload.getPrecio());
        existente.setImagenUrl(payload.getImagenUrl());
        existente.setUrl(payload.getUrl());

        existente.getHorarios().clear();
        for (Horario h : payload.getHorarios()) {
            h.setPlan(existente);
            existente.getHorarios().add(h);
        }
       
        fijarRelacionesYCalcularCruce(existente);

        return repo.save(existente);
    }


    public void deleteById(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Plan con id " + id + " no encontrado");
        }
        repo.deleteById(id);
    }
    
    private void fijarRelacionesYCalcularCruce(Plan p) {
        for (Horario h : p.getHorarios()) {
            h.setPlan(p);
            boolean cruza = h.getHoraFin().isBefore(h.getHoraInicio());
            h.setCruzaMedianoche(cruza);
        }
    }
        
}
