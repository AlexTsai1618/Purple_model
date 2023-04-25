import React from 'react';

function AttackContent() {
  return <p>This is the attack content.</p>;
}

function DefenseContent() {
  return <p>This is the defense content.</p>;
}

export default function Content({ pageType }) {
  return (
    <div>
      {pageType === 'attack' && <AttackContent />}
      {pageType === 'defend' && <DefenseContent />}
    </div>
  );
}
