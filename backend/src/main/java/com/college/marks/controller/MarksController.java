package com.college.marks.controller;

import com.college.marks.dto.MarkUpdateRequest;
import com.college.marks.entity.Mark;
import com.college.marks.entity.Staff;
import com.college.marks.entity.Student;
import com.college.marks.entity.Subject;
import com.college.marks.repository.MarkRepository;
import com.college.marks.repository.StaffRepository;
import com.college.marks.repository.StudentRepository;
import com.college.marks.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/{studentId}")
    public ResponseEntity<List<Mark>> getStudentMarks(@PathVariable String studentId) {
        return ResponseEntity.ok(markRepository.findByStudentRegNo(studentId));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateMarks(@RequestBody MarkUpdateRequest request) {
        
        if(request.getMarks() != null && (request.getMarks() < 0 || request.getMarks() > 60)) {
            return ResponseEntity.badRequest().body("Marks must be between 0 and 60.");
        }

        // Get authenticated staff
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Staff> staffOpt = staffRepository.findById(userDetails.getUsername());
        
        if(staffOpt.isEmpty()) {
            // Try finding by iterating (username may differ from empId)
            staffOpt = staffRepository.findAll().stream()
                .filter(s -> s.getEmpId().equals(userDetails.getUsername()))
                .findFirst();
        }
        
        if(staffOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Not authorized to update marks. Staff record not found.");
        }

        // Find existing mark or create new one (UPSERT)
        Mark mark = markRepository.findByStudentRegNoAndSubjectSubjectId(request.getStudentId(), request.getSubjectId());
        
        if(mark == null) {
            // Create new mark record
            Optional<Student> studentOpt = studentRepository.findById(request.getStudentId());
            Optional<Subject> subjectOpt = subjectRepository.findById(request.getSubjectId());
            
            if (studentOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Student not found: " + request.getStudentId());
            }
            if (subjectOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Subject not found: " + request.getSubjectId());
            }
            
            mark = new Mark();
            mark.setStudent(studentOpt.get());
            mark.setSubject(subjectOpt.get());
        }

        if("CT1".equalsIgnoreCase(request.getExam())) {
            mark.setCt1Marks(request.getMarks());
        } else if("CT2".equalsIgnoreCase(request.getExam())) {
            mark.setCt2Marks(request.getMarks());
        } else {
            return ResponseEntity.badRequest().body("Invalid exam type. Must be CT1 or CT2.");
        }

        mark.setLastUpdatedBy(staffOpt.get());
        markRepository.save(mark);

        return ResponseEntity.ok("Marks updated successfully.");
    }
}
