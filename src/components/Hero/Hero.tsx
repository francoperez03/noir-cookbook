function Hero() {
  return (
    <div className="hero-container">
      <h1 className="hero-title">Calculador de Pagos con Pruebas</h1>
      <p className="hero-description">
        Este formulario te permite calcular si un pago es válido asegurándote de que sea menor o igual a tu balance,
        incluyendo un límite máximo y una tarifa (fee rate). Ajustá los parámetros para generar una prueba.
      </p>
    </div>
  );
}

export default Hero;
