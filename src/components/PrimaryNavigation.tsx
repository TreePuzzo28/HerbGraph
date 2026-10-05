import { NavLink } from 'react-router-dom';

const browseLinks = [
  { to: '/challenges', label: 'Health challenges' },
  { to: '/actions', label: 'Actions' },
  { to: '/herbs', label: 'Herbs' },
];

export function PrimaryNavigation() {
  return (
    <nav aria-label="Browse entry types">
      <ul className="primary-navigation">
        {browseLinks.map(({ to, label }) => (
          <li key={to}>
            <NavLink to={to}>{label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
