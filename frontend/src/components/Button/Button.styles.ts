export const buttonStyles = `
  .btn { display:inline-flex; align-items:center; gap:.5rem; border-radius:8px; font-weight:800; cursor:pointer; transition:all .15s ease; border:1px solid transparent; padding:.4rem .8rem; font-size:.9rem; }
  .btn:disabled { opacity:.6; cursor:not-allowed; }
  .btn-primary { background:#c9a227; color:#0b0e12; border-color:#a88a23; }
  .btn-primary:hover { filter:brightness(1.05); box-shadow:0 0 0 2px rgba(201,162,39,.18); }
  .btn-secondary { background:#12161c; color:#e4e0cf; border-color:#2a2f37; }
  .btn-secondary:hover { background:#1a212b; box-shadow:0 0 0 2px rgba(201,162,39,.12); }
  .btn-ghost { background:transparent; color:#e4e0cf; border-color:#2a2f37; }
  .btn-ghost:hover { background:#12161c; }
  .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg) } }
`;


