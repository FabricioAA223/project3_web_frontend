import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeightHeightCard from './components/WeightHeightCard';
import { Activity, Clock } from 'lucide-react';
import BodyCompositionChart from './components/BodyCompositionChart';
import BMICard from './components/BMICard';
import WaterIntakeCard from './components/WaterIntakeCard';
import StepCountCard from './components/StepCountCard';
import ExerciseList from './components/ExerciseList';
import BodyFatPercentageCard from './components/BodyFatPercentageCard';
import ImportDataButton from './ImportDataButton';
import './Dashboard.css';
import { HistoricalView } from './components/HistoricalView';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newData, setNewData] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/dashboard/view', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [newData]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dashboardData) return <div className="no-data">No hay datos disponibles</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard de Salud</h1>
      <ImportDataButton onDataImported={() => setNewData(!newData)} />
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Activity size={24} />
          <span>Vista General</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'historical' ? 'active' : ''}`}
          onClick={() => setActiveTab('historical')}
        >
          <Clock size={24} />
          <span>Histórico</span>
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'general' && (
          <div className="dashboard-grid">
            <WeightHeightCard weight={dashboardData.weight} height={dashboardData.height} />
            <BodyCompositionChart composition={dashboardData.body_composition} />
            <BMICard weight={dashboardData.weight} height={dashboardData.height} />
            <BodyFatPercentageCard bodyFatPercentage={dashboardData.body_fat_percentage} />
            <WaterIntakeCard waterIntake={dashboardData.water_consumption_today} />
            <StepCountCard stepCount={dashboardData.daily_steps} />
            <ExerciseList exercises={dashboardData.exercises_today} />
          </div>
        )}
        {activeTab === 'historical' && (
          <div className="historical-view">
            <HistoricalView newData={newData} />
          </div>
        )}
      </div>
    </div>
  );
}
