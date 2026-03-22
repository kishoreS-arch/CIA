package com.college.marks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.college.marks.entity.Student;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByClassSection(String classSection);
    List<Student> findByYear(Integer year);
    List<Student> findByDepartment(String department);
    List<Student> findByDepartmentAndYear(String department, Integer year);
}
