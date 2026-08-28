function DashboardCard({ label, value, detail, tone = 'default' }) {
  return (
    <article className={`dashboard-card dashboard-card--${tone}`}>
      <span className="dashboard-card__label">{label}</span>
      <strong className="dashboard-card__value">{value}</strong>
      <p>{detail}</p>
    </article>
  )
}

export default DashboardCard
