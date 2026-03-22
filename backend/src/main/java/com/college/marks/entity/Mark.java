package com.college.marks.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "marks")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Mark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_reg_no")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Subject subject;

    private Integer ct1Marks;
    
    private Integer ct2Marks;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "last_updated_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Staff lastUpdatedBy;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

    public Integer getCt1Marks() { return ct1Marks; }
    public void setCt1Marks(Integer ct1Marks) { this.ct1Marks = ct1Marks; }

    public Integer getCt2Marks() { return ct2Marks; }
    public void setCt2Marks(Integer ct2Marks) { this.ct2Marks = ct2Marks; }

    public Staff getLastUpdatedBy() { return lastUpdatedBy; }
    public void setLastUpdatedBy(Staff lastUpdatedBy) { this.lastUpdatedBy = lastUpdatedBy; }
}
