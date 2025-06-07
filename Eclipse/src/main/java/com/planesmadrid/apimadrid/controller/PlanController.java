package com.planesmadrid.apimadrid.controller;

import com.planesmadrid.apimadrid.model.Dia;
import com.planesmadrid.apimadrid.model.Plan;
import com.planesmadrid.apimadrid.service.PlanService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/planes")
@CrossOrigin(origins = "*")
public class PlanController {

    private final PlanService service;

    public PlanController(PlanService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Plan>> all() {
        return ResponseEntity.ok(service.findAll());
    }

  //GET /api/planes/filter?dia=VIERNES&horaMin=19:00&horaMax=00:00&precioMin=0&precioMax=50
     
    @GetMapping("/filter")
    public ResponseEntity<List<Plan>> filter(
            @RequestParam(name = "dia",       required = false) Dia dia,
            @RequestParam(name = "horaMin",   required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaMin,
            @RequestParam(name = "horaMax",   required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaMax,
            @RequestParam(name = "precioMin", required = false) Double precioMin,
            @RequestParam(name = "precioMax", required = false) Double precioMax
    ) {
        List<Plan> results = service.filter(dia, horaMin, horaMax, precioMin, precioMax);
        return ResponseEntity.ok(results);
    }


    @PostMapping
    public ResponseEntity<Plan> create(@RequestBody Plan plan) {
        for (var h : plan.getHorarios()) {
            h.setPlan(plan);
        }
        Plan saved = service.save(plan);
        return ResponseEntity.status(201).body(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Plan> update(
        @PathVariable Long id,
        @RequestBody Plan updatedPayload) {
        Plan updated = service.update(id, updatedPayload);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}
