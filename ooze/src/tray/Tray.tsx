
export default function Tray() {
    return <div style={{
        position: 'relative',
    }}>
        <div style={{
            position: 'fixed',
            top: "90%",
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
        }}>
            Tray
        </div>
        
    </div>
}