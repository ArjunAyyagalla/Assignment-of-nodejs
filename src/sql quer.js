SELECT c.customerId, c.name, GROUP_CONCAT(s.subjectName ORDER BY s.subjectName ASC) AS subjects
FROM customers c
JOIN mapping m ON c.customerId = m.customerId
JOIN Subjects s ON m.subjectId = s.subjectId
GROUP BY c.customerId, c.name
ORDER BY c.name ASC;
