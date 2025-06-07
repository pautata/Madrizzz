package com.planesmadrid.apimadrid.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.planesmadrid.apimadrid.model.Dia;
import com.planesmadrid.apimadrid.model.Horario;
import com.planesmadrid.apimadrid.model.Plan;
import com.planesmadrid.apimadrid.service.PlanService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlanController.class)
class PlanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlanService planService;

    @Autowired
    private ObjectMapper objectMapper; // para serializar json

    @Test
    @DisplayName("GET /api/planes → 200 OK y lista vacía cuando no hay planes")
    void testGetAll_whenNoPlanes() throws Exception {
        given(planService.findAll()).willReturn(Collections.emptyList());

        mockMvc.perform(get("/api/planes"))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("GET /api/planes → 200 OK y devuelve lista con un plan")
    void testGetAll_whenOnePlan() throws Exception {
        Plan plan = new Plan();
        plan.setId(1L);
        plan.setNombre("Tour Histórico");
        plan.setLocalizacion("Plaza Mayor");
        plan.setPrecio(15.0);
        plan.setImagenUrl("/images/tourhistorico.png");
        plan.setUrl("https://tours.madrid.es/historico");
        plan.setHorarios(new ArrayList<>()); // lista mutable

        given(planService.findAll()).willReturn(List.of(plan));

        mockMvc.perform(get("/api/planes"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$", hasSize(1)))
               .andExpect(jsonPath("$[0].id", is(1)))
               .andExpect(jsonPath("$[0].nombre", is("Tour Histórico")));
    }

    @Test
    @DisplayName("GET /api/planes/filter?dia=VIERNES&horaMin=19:00&horaMax=23:00&precioMin=0&precioMax=50 → 200 OK")
    void testFilter_withAllParams() throws Exception {
        Plan plan = new Plan();
        plan.setId(2L);
        plan.setNombre("Brunch Dominical");
        plan.setLocalizacion("Malasaña");
        plan.setPrecio(25.50);
        plan.setImagenUrl("/images/brunchdominical.png");
        plan.setUrl("https://brunch.madrid.es/dominical");
        plan.setHorarios(new ArrayList<>());

        given(planService.filter(
                eq(Dia.VIERNES),
                eq(LocalTime.of(19, 0)),
                eq(LocalTime.of(23, 0)),
                eq(0.0),
                eq(50.0)
        )).willReturn(List.of(plan));

        mockMvc.perform(get("/api/planes/filter")
                        .param("dia", "VIERNES")
                        .param("horaMin", "19:00")
                        .param("horaMax", "23:00")
                        .param("precioMin", "0")
                        .param("precioMax", "50"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$", hasSize(1)))
               .andExpect(jsonPath("$[0].id", is(2)))
               .andExpect(jsonPath("$[0].nombre", is("Brunch Dominical")));
    }

    @Test
    @DisplayName("GET /api/planes/filter sin parámetros → 200 OK, delega en service.filter(null, null, null, null, null)")
    void testFilter_noParams() throws Exception {
        given(planService.filter(null, null, null, null, null)).willReturn(Collections.emptyList());

        mockMvc.perform(get("/api/planes/filter"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("POST /api/planes → 201 Created con el plan guardado")
    void testCreatePlan() throws Exception {
        
        Plan nuevo = new Plan();
        nuevo.setNombre("Tour Fotográfico");
        nuevo.setLocalizacion("Lavapiés");
        nuevo.setPrecio(18.0);
        nuevo.setImagenUrl("/images/tourfotografico.png");
        nuevo.setUrl("https://fotomadrid.es/lavapies");

        Horario h = new Horario();
        h.setDiaInicio(Dia.VIERNES);
        h.setHoraInicio(LocalTime.of(16, 0));
        h.setHoraFin(LocalTime.of(19, 0));
  

        List<Horario> horariosNuevos = new ArrayList<>(List.of(h));
        nuevo.setHorarios(horariosNuevos);

   
        Plan guardado = new Plan();
        guardado.setId(5L);
        guardado.setNombre(nuevo.getNombre());
        guardado.setLocalizacion(nuevo.getLocalizacion());
        guardado.setPrecio(nuevo.getPrecio());
        guardado.setImagenUrl(nuevo.getImagenUrl());
        guardado.setUrl(nuevo.getUrl());

  
        Horario hGuardado = new Horario();
        hGuardado.setId(100L); // suponemos que Hibernate le dio id=100
        hGuardado.setDiaInicio(h.getDiaInicio());
        hGuardado.setHoraInicio(h.getHoraInicio());
        hGuardado.setHoraFin(h.getHoraFin());
        hGuardado.setPlan(guardado);
        hGuardado.setCruzaMedianoche(false);

        List<Horario> horariosGuardados = new ArrayList<>(List.of(hGuardado));
        guardado.setHorarios(horariosGuardados);

        given(planService.save(ArgumentMatchers.any(Plan.class)))
                .willReturn(guardado);

        // Hace el post y verifica la respuesta
        mockMvc.perform(post("/api/planes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nuevo)))
               .andExpect(status().isCreated())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.id", is(5)))
               .andExpect(jsonPath("$.nombre", is("Tour Fotográfico")));
    }

    @Test
    @DisplayName("DELETE /api/planes/{id} → 200 OK y {\"deleted\":true}")
    void testDeletePlan() throws Exception {
        willDoNothing().given(planService).deleteById(ArgumentMatchers.eq(3L));

        mockMvc.perform(delete("/api/planes/{id}", 3L))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.deleted", is(true)));
    }
}
