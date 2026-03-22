package com.college.marks.dto;

public class MarkUpdateRequest {
    private String studentId;
    private String subjectId;
    private String exam;
    private Integer marks;

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getExam() { return exam; }
    public void setExam(String exam) { this.exam = exam; }

    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }
}
