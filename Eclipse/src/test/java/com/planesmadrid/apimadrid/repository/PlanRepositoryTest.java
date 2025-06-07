package com.planesmadrid.apimadrid.repository;

import com.planesmadrid.apimadrid.model.Dia;
import com.planesmadrid.apimadrid.model.Plan;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)

@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb"
})
class PlanRepositoryTest {

    @Autowired
    private PlanRepository planRepository;

    @Test
    @DisplayName("findAll() devuelve todos los planes insertados en data.sql")
    void testFindAll() {
        List<Plan> planes = planRepository.findAll();
        // data.sql inserta 24 planes
        assertThat(planes).hasSize(24);
    }

    @Test
    @DisplayName("findByOptionalFilters sin filtros devuelve todos los planes (DISTINCT)")
    void testFindByOptionalFilters_noFilters() {
        List<Plan> planes = planRepository.findByOptionalFilters(null, null, null, null, null);
        assertThat(planes).hasSize(24);
    }

    @Test
    @DisplayName("findByOptionalFilters por día (VIERNES) devuelve planes con horario ese día")
    void testFindByOptionalFilters_byDia() {
        List<Plan> viernesPlanes = planRepository.findByOptionalFilters(Dia.VIERNES, null, null, null, null);
        assertThat(viernesPlanes).isNotEmpty();
        boolean existePlan1 = viernesPlanes.stream().anyMatch(p -> p.getId().equals(1L));
        assertThat(existePlan1).isTrue();
    }

    @Test
    @DisplayName("findByOptionalFilters por rango de hora (20:00–23:00) incluye plan ID=3")
    void testFindByOptionalFilters_byHourRange() {
        LocalTime horaMin = LocalTime.of(20, 0);
        LocalTime horaMax = LocalTime.of(23, 0);

        List<Plan> results = planRepository.findByOptionalFilters(null, horaMin, horaMax, null, null);
        boolean existePlan3 = results.stream().anyMatch(p -> p.getId().equals(3L));
        assertThat(existePlan3).isTrue();
    }

    @Test
    @DisplayName("findByOptionalFilters con cruce de medianoche incluye plan ID=19")
    void testFindByOptionalFilters_cruzaMedianoche() {
        LocalTime horaMin = LocalTime.of(22, 0);
        LocalTime horaMax = LocalTime.of(23, 59);

        List<Plan> results = planRepository.findByOptionalFilters(null, horaMin, horaMax, null, null);
        boolean existePlan19 = results.stream().anyMatch(p -> p.getId().equals(19L));
        assertThat(existePlan19).isTrue();
    }

    @Test
    @DisplayName("findByOptionalFilters por precio (20–30) sólo devuelve planes en ese rango")
    void testFindByOptionalFilters_byPrecio() {
        Double precioMin = 20.0;
        Double precioMax = 30.0;

        List<Plan> planesPrecio = planRepository.findByOptionalFilters(null, null, null, precioMin, precioMax);
        assertThat(planesPrecio).allMatch(p -> p.getPrecio() >= precioMin && p.getPrecio() <= precioMax);
    }

    @Test
    @DisplayName("findByOptionalFilters combinado (VIERNES, 20:00–23:59, precio ≤ 20) → Debe devolver 4 planes: IDs 5,9,12,21")
    void testFindByOptionalFilters_combined() {
        Dia dia = Dia.VIERNES;
        LocalTime horaMin = LocalTime.of(20, 0);
        LocalTime horaMax = LocalTime.of(23, 59);
        Double precioMin = 0.0;
        Double precioMax = 20.0;

        List<Plan> results = planRepository.findByOptionalFilters(dia, horaMin, horaMax, precioMin, precioMax);
  
        assertThat(results).hasSize(4);
     
        List<Long> idsEncontrados = results.stream().map(Plan::getId).toList();
        assertThat(idsEncontrados).containsExactlyInAnyOrder(5L, 9L, 12L, 21L);

        assertThat(results).allMatch(p -> p.getPrecio() <= 20.0);
    }
}
