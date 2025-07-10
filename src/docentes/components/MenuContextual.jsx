import { useEffect } from 'react';

const MenuContextual = ({ 
    menuContextual, 
    cerrarMenuContextual, 
    handleOpcionMenu 
}) => {
    // Cerrar menú contextual al hacer clic fuera
    useEffect(() => {
        const handleClickFuera = () => {
            if (menuContextual.mostrar) {
                cerrarMenuContextual();
            }
        };

        document.addEventListener('click', handleClickFuera);
        return () => document.removeEventListener('click', handleClickFuera);
    }, [menuContextual.mostrar, cerrarMenuContextual]);

    if (!menuContextual.mostrar) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: menuContextual.y,
                left: menuContextual.x,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                zIndex: 2000,
                minWidth: '150px'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {menuContextual.tipo === 'alumno' && (
                <>
                    <div
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            ':hover': { backgroundColor: '#f5f5f5' }
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                        onClick={() => handleOpcionMenu('verNotas')}
                    >
                        Ver notas
                    </div>
                    <div
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            ':hover': { backgroundColor: '#f5f5f5' }
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                        onClick={() => handleOpcionMenu('cambiarGrupo')}
                    >
                        Cambiar grupo
                    </div>
                </>
            )}
            {menuContextual.tipo === 'grupo' && (
                <div
                    style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        color: '#dc3545',
                        ':hover': { backgroundColor: '#f5f5f5' }
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => handleOpcionMenu('eliminarGrupo')}
                >
                    Eliminar grupo
                </div>
            )}
        </div>
    );
};

export default MenuContextual; 