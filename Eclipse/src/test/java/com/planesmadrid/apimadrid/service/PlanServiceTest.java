package com.planesmadrid.apimadrid.service;

import com.planesmadrid.apimadrid.exception.ResourceNotFoundException;
import com.planesmadrid.apimadrid.model.Dia;
import com.planesmadrid.apimadrid.model.Plan;
import com.planesmadrid.apimadrid.repository.PlanRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class PlanServiceAdditionalTests {

    @Mock
    private PlanRepository planRepository;

    @InjectMocks
    private PlanService planService;

    @Test
    @DisplayName("filter() con horaMin > horaMax y sin cruce retorna lista vacía")
    void testFilter_horaMinMayor_horaMaxSinCruce() {
        Dia dia = null;
        LocalTime horaMin = LocalTime.of(18, 0);
        LocalTime horaMax = LocalTime.of(17, 0);
        Double precioMin = null;
        Double precioMax = null;

 
        given(planRepository.findByOptionalFilters(dia, horaMin, horaMax, precioMin, precioMax))
                .willReturn(Collections.emptyList());

        List<Plan> result = planService.filter(dia, horaMin, horaMax, precioMin, precioMax);

        assertThat(result).isEmpty();
        then(planRepository).should().findByOptionalFilters(dia, horaMin, horaMax, precioMin, precioMax);
    }

    @Test
    @DisplayName("save() maneja plan sin horarios (lista vacía) sin excepciones")
    void testSave_conListaHorariosVacia() {
        Plan plan = new Plan();
        plan.setNombre("Plan sin horarios");
        plan.setLocalizacion("Donde sea");
        plan.setPrecio(0.0);
        plan.setHorarios(Collections.emptyList());

        // Simulamos el repositorio devolviendo un plan con id 99
        Plan persisted = new Plan();
        persisted.setId(99L);
        persisted.setNombre(plan.getNombre());
        persisted.setLocalizacion(plan.getLocalizacion());
        persisted.setPrecio(plan.getPrecio());
        persisted.setHorarios(Collections.emptyList());

        given(planRepository.save(plan)).willReturn(persisted);

        Plan result = planService.save(plan);

        assertThat(result.getId()).isEqualTo(99L);
        assertThat(result.getHorarios()).isEmpty();
        then(planRepository).should().save(plan);
    }

    @Test
    @DisplayName("deleteById() lanza ResourceNotFoundException si el plan no existe")
    void testDeleteById_noExisteLanzaResourceNotFound() {
        Long idInexistente = 123L;

        // Se simola que repository.existsById(id) devuelve false
        given(planRepository.existsById(idInexistente)).willReturn(false);

        // comprobamos que lanza ResourceNotFoundException
        assertThatThrownBy(() -> planService.deleteById(idInexistente))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Plan con id " + idInexistente + " no encontrado");

        then(planRepository).should().existsById(idInexistente);
        then(planRepository).should(never()).deleteById(idInexistente);
    }
}
