import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Loader2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const LearningCurveView = ({ onBack, userId, subjects }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [userId, subjects]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { fetchLearningCurveData } = await import('../services/api');
      const { getLecturesForSubject } = await import('../services/db');

      // Fetch lectures for each subject and transform data to match backend format
      const subjectsData = await Promise.all(subjects.map(async (subject) => {
        const lectures = await getLecturesForSubject(userId, subject.id);

        // Transform lectures to match backend expected format
        // Backend expects: lectures[].attempts[].{score, total, timestamp}
        // DB stores: lectures[].scores[].{score, timestamp}
        const transformedLectures = lectures.map(lecture => ({
          id: lecture.id,
          title: lecture.title,
          attempts: (lecture.scores || []).map(s => ({
            score: s.score,
            total: 10, // Quiz has 10 questions
            timestamp: new Date(s.timestamp).getTime()
          }))
        }));

        return {
          subjectId: subject.id,
          subjectName: subject.name,
          lectures: transformedLectures
        };
      }));

      const data = await fetchLearningCurveData(userId, subjectsData);
      setChartData(data);
    } catch (err) {
      console.error("Failed to fetch learning curve data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBarColor = (percentage) => {
    if (percentage >= 70) return '#48bb78';
    if (percentage >= 40) return '#ecc94b';
    return '#f56565';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'var(--bg-color, #1a202c)',
          border: '1px solid var(--border-color, #2d3748)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: 1000
        }}>
          <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary, #fff)' }}>
            {data.subjectName}
          </p>
          <p style={{ color: '#4299e1', fontSize: '1.2rem', fontWeight: 700 }}>
            {data.percentage}%
          </p>
          {data.metrics && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #a0aec0)', marginTop: '0.5rem' }}>
              <div>Avg Score: {(data.metrics.avgScore * 100).toFixed(0)}%</div>
              <div>Consistency: {(data.metrics.consistency * 100).toFixed(0)}%</div>
              <div>Coverage: {(data.metrics.coverage * 100).toFixed(0)}%</div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="spinner" size={48} color="#4285f4" />
        <p className="google-font" style={{ color: 'var(--text-secondary, #a0aec0)' }}>Loading Learning Curve...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-color, #1a202c)', padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border-color, #2d3748)' }}>
          <h3 className="google-font" style={{ color: '#e53e3e', marginBottom: '1rem' }}>Error Loading Data</h3>
          <p style={{ color: 'var(--text-secondary, #a0aec0)', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={onBack} className="btn-modern btn-glass">
            <ArrowLeft size={20} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasData = chartData.some(item => item.percentage > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ minHeight: '100vh', padding: '2rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={onBack}
          className="btn-modern btn-glass"
          style={{ padding: '0.6rem', borderRadius: '50%' }}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="google-font" style={{ margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp className="text-gradient" size={32} />
            Learning Curve
          </h2>
          <p style={{ color: 'var(--text-secondary, #a0aec0)', margin: 0 }}>
            Track your understanding level across all subjects
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        background: 'var(--bg-color, #1a202c)',
        borderRadius: '32px',
        border: '1px solid var(--border-color, #2d3748)',
        padding: '2rem',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {!hasData ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '4rem 2rem'
          }}>
            <div style={{
              background: 'rgba(66, 153, 225, 0.1)',
              padding: '2rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 size={80} color="#4299e1" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 className="google-font" style={{ color: 'var(--text-primary, #fff)', fontSize: '1.8rem', marginBottom: '1rem' }}>
                No Quiz Data Available
              </h3>
              <p style={{ color: 'var(--text-secondary, #a0aec0)', fontSize: '1.1rem', maxWidth: '450px', margin: '0 auto', lineHeight: '1.6' }}>
                Start taking quizzes in your subjects! Once you complete a few quizzes, we'll analyze your performance and show your learning curve accurately.
              </p>
            </div>
            <button
              onClick={onBack}
              className="btn-modern btn-glass"
              style={{ marginTop: '1rem', padding: '0.8rem 2rem' }}
            >
              Start Learning
            </button>
          </div>
        ) : (
          <>
            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 16, height: 16, borderRadius: '4px', background: '#48bb78' }}></div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #a0aec0)' }}>Excellent (≥70%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 16, height: 16, borderRadius: '4px', background: '#ecc94b' }}></div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #a0aec0)' }}>Good (40-69%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 16, height: 16, borderRadius: '4px', background: '#f56565' }}></div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #a0aec0)' }}>Needs Work (&lt;40%)</span>
              </div>
            </div>

            {/* Chart */}
            <div style={{ width: '100%', height: '500px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="subjectName"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#718096', fontSize: 12 }}
                    label={{ value: 'Subjects', position: 'insideBottom', offset: -20, style: { fill: '#718096', fontSize: 14, fontWeight: 600 } }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#718096' }}
                    label={{
                      value: 'Understanding Level (%)',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 10,
                      style: { fill: '#718096', fontSize: 14, fontWeight: 600, textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="percentage" maxBarSize={80}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--google-blue)' }}>
                  {chartData.length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Subjects</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#48bb78' }}>
                  {chartData.filter(d => d.percentage >= 70).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Excellent</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--google-blue)' }}>
                  {(chartData.reduce((sum, d) => sum + d.percentage, 0) / chartData.length).toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Average Score</div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default LearningCurveView;
