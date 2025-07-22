'use client'

import Clock from './clock';

export default function Display() {

  return (
    <div style={styles.box}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <div style={styles.middle}>
          <div className="w-[384px] h-[216px] bg-blue-200">
            
          </div>
        </div>
        <div style={styles.upper}>
          <Clock />
        </div>
      </div>
    </div>
  )
}

const styles = {
  box: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '2rem',
    zIndex: 999,
    transition: 'opacity 0.2s',
    color: 'white'
  },
  middle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  upper: {
    position: 'absolute',
    top: '29%',
    left: '50%',
    transform: 'translate(-50%, calc(-100% - 20px))',
  },
};
