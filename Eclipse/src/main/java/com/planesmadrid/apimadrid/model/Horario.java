package com.planesmadrid.apimadrid.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "HORARIO")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "DIA_INICIO", nullable = false)
    private Dia diaInicio;

    @Column(name = "HORA_INICIO", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "HORA_FIN", nullable = false)
    private LocalTime horaFin;

    @Column(name = "CRUZA_MEDIANOCHE", nullable = false)
    private boolean cruzaMedianoche;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PLAN_ID", nullable = false)
    @JsonBackReference // para evitar un bucle infinito de plan y horario
    private Plan plan;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Dia getDiaInicio() {
        return diaInicio;
    }
    public void setDiaInicio(Dia diaInicio) {
        this.diaInicio = diaInicio;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }
    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }
    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public boolean isCruzaMedianoche() {
        return cruzaMedianoche;
    }
    public void setCruzaMedianoche(boolean cruzaMedianoche) {
        this.cruzaMedianoche = cruzaMedianoche;
    }

    public Plan getPlan() {
        return plan;
    }
    public void setPlan(Plan plan) {
        this.plan = plan;
    }
}
