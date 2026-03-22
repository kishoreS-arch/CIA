package com.college.marks.controller;

import com.college.marks.entity.Mark;
import com.college.marks.entity.Student;
import com.college.marks.repository.MarkRepository;
import com.college.marks.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private StudentRepository studentRepository;

    // GET /api/analytics/summary?classId=3-A&exam=CT1
    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(
            @RequestParam(required = false) String classId,
            @RequestParam(defaultValue = "CT1") String exam) {

        List<Mark> marks = classId != null 
            ? markRepository.findBySubjectClassId(classId) 
            : markRepository.findAll();

        Set<String> allStudents = new HashSet<>();
        Set<String> failStudents = new HashSet<>();

        for (Mark m : marks) {
            allStudents.add(m.getStudent().getRegNo());
            Integer score = "CT1".equalsIgnoreCase(exam) ? m.getCt1Marks() : m.getCt2Marks();
            if (score != null && score < 30) {
                failStudents.add(m.getStudent().getRegNo());
            }
        }

        int total = allStudents.size();
        int failures = failStudents.size();
        int pass = total - failures;
        double passPercent = total > 0 ? Math.round((pass * 100.0 / total) * 10.0) / 10.0 : 0;

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalStudents", total);
        summary.put("passCount", pass);
        summary.put("failCount", failures);
        summary.put("passPercentage", passPercent);

        return ResponseEntity.ok(summary);
    }

    // GET /api/analytics/toppers?classId=3-A&exam=CT1&limit=10
    @GetMapping("/toppers")
    public ResponseEntity<?> getToppers(
            @RequestParam(required = false) String classId,
            @RequestParam(defaultValue = "CT1") String exam,
            @RequestParam(defaultValue = "10") int limit) {

        List<Mark> marks = classId != null 
            ? markRepository.findBySubjectClassId(classId) 
            : markRepository.findAll();

        // Aggregate total marks per student
        Map<String, Integer> studentTotals = new LinkedHashMap<>();
        Map<String, String> studentNames = new LinkedHashMap<>();

        for (Mark m : marks) {
            String regNo = m.getStudent().getRegNo();
            Integer score = "CT1".equalsIgnoreCase(exam) ? m.getCt1Marks() : m.getCt2Marks();
            studentTotals.merge(regNo, score != null ? score : 0, Integer::sum);
            studentNames.putIfAbsent(regNo, m.getStudent().getName());
        }

        // Sort by total desc and take top N
        List<Map<String, Object>> toppers = studentTotals.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(limit)
            .map(entry -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("regNo", entry.getKey());
                row.put("name", studentNames.get(entry.getKey()));
                row.put("totalMarks", entry.getValue());
                return row;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(toppers);
    }

    // GET /api/analytics/failures?classId=3-A&exam=CT1
    @GetMapping("/failures")
    public ResponseEntity<?> getFailures(
            @RequestParam(required = false) String classId,
            @RequestParam(defaultValue = "CT1") String exam) {

        List<Mark> marks = classId != null 
            ? markRepository.findBySubjectClassId(classId) 
            : markRepository.findAll();

        List<Map<String, Object>> failures = new ArrayList<>();

        for (Mark m : marks) {
            Integer score = "CT1".equalsIgnoreCase(exam) ? m.getCt1Marks() : m.getCt2Marks();
            if (score != null && score < 30) {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("regNo", m.getStudent().getRegNo());
                row.put("name", m.getStudent().getName());
                row.put("subjectId", m.getSubject().getSubjectId());
                row.put("subjectName", m.getSubject().getSubjectName());
                row.put("marks", score);
                failures.add(row);
            }
        }

        return ResponseEntity.ok(failures);
    }

    // GET /api/analytics/class-marks?classId=3-A&exam=CT1
    @GetMapping("/class-marks")
    public ResponseEntity<?> getClassMarks(
            @RequestParam(required = false) String classId,
            @RequestParam(defaultValue = "CT1") String exam) {

        List<Mark> marks = classId != null 
            ? markRepository.findBySubjectClassId(classId) 
            : markRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Mark m : marks) {
            Integer score = "CT1".equalsIgnoreCase(exam) ? m.getCt1Marks() : m.getCt2Marks();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("regNo", m.getStudent().getRegNo());
            row.put("studentName", m.getStudent().getName());
            row.put("subjectId", m.getSubject().getSubjectId());
            row.put("subjectName", m.getSubject().getSubjectName());
            row.put("marks", score);
            result.add(row);
        }

        return ResponseEntity.ok(result);
    }

    // GET /api/analytics/subject-averages?classId=3-A&exam=CT1
    @GetMapping("/subject-averages")
    public ResponseEntity<?> getSubjectAverages(
            @RequestParam(required = false) String classId,
            @RequestParam(defaultValue = "CT1") String exam) {

        List<Mark> marks = classId != null 
            ? markRepository.findBySubjectClassId(classId) 
            : markRepository.findAll();

        Map<String, List<Integer>> subjectScores = new LinkedHashMap<>();
        Map<String, String> subjectNames = new LinkedHashMap<>();

        for (Mark m : marks) {
            String subId = m.getSubject().getSubjectId();
            Integer score = "CT1".equalsIgnoreCase(exam) ? m.getCt1Marks() : m.getCt2Marks();
            subjectNames.putIfAbsent(subId, m.getSubject().getSubjectName());
            subjectScores.computeIfAbsent(subId, k -> new ArrayList<>());
            if (score != null) {
                subjectScores.get(subId).add(score);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (var entry : subjectScores.entrySet()) {
            List<Integer> scores = entry.getValue();
            double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("subjectId", entry.getKey());
            row.put("subjectName", subjectNames.get(entry.getKey()));
            row.put("average", Math.round(avg * 10.0) / 10.0);
            row.put("maxScore", 60);
            result.add(row);
        }

        return ResponseEntity.ok(result);
    }

    // GET /api/analytics/rankings (backward compatible)
    @GetMapping("/rankings")
    public ResponseEntity<?> getRankings() {
        return getToppers(null, "CT1", 10);
    }
}
