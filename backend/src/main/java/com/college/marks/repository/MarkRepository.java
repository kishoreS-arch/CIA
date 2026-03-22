package com.college.marks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.college.marks.entity.Mark;
import java.util.List;

public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByStudentRegNo(String regNo);
    Mark findByStudentRegNoAndSubjectSubjectId(String regNo, String subjectId);
    
    @Query("SELECT m FROM Mark m WHERE m.subject.classId = :classId")
    List<Mark> findBySubjectClassId(@Param("classId") String classId);

    List<Mark> findAll();
}
