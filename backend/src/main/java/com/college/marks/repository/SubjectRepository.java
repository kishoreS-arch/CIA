package com.college.marks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.college.marks.entity.Subject;

public interface SubjectRepository extends JpaRepository<Subject, String> {
}
