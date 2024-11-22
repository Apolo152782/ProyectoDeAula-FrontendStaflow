import React from 'react';

const HomePage = () => {
    const styles = {
        hero: {
            paddingTop: '60px',
            minHeight: '400px',
            background: 'linear-gradient(rgb(144, 141, 199), rgba(255, 255, 255, 0.9)), url("/api/placeholder/1920/1080") center/cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',

            padding: '2rem',
        },
        heroContent: {
            maxWidth: '800px',
            color: '#5b8fb9',
        },
        heroTitle: {
            fontSize: '3rem',
            marginBottom: '1rem',
            color: '#ff5e5e',
        },
        heroSubtitle: {
            fontSize: '1.9rem',
            marginBottom: '1.5rem',
            color: '#5b8fb9',
        },
        featuresSection: {
            padding: '2rem',
            backgroundColor: '#FFFFFFE6',
        },
        featuresContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        featuresGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem',
        },
        featureCard: {
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        featureTitle: {
            color: '#ff9494',
            fontSize: '1.2rem',
            marginBottom: '0.8rem',
        },
        featureDescription: {
            color: '#666',
            lineHeight: '1.6',
        },
        sectionTitle: {
            color: '#5b8fb9',
            textAlign: 'center',
            fontSize: '3rem',
            marginBottom: '1rem',
        },
        sectionSubtitle: {
            color: '#666',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 2rem',
            lineHeight: '1.6',
        },
    };

    return (
        <div>
            <main style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Bienvenido a StackFlow</h1>
                    <p style={styles.heroSubtitle}>Sistema de punto de venta intuitivo y eficiente para tu negocio</p>
                </div>
            </main>

            <section style={styles.featuresSection}>
                <div style={styles.featuresContainer}>
                    <h2 style={styles.sectionTitle}>Características del Sistema</h2>
                    <p style={styles.sectionSubtitle}>
                        Descubre todas las herramientas que StackFlow tiene para optimizar tu negocio
                    </p>

                    <div style={styles.featuresGrid}>
                        <div style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>Gestión de Clientes</h3>
                            <p style={styles.featureDescription}>
                                Administra tu base de clientes, historial de compras y preferencias. Mantén un
                                seguimiento detallado de cada interacción.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>Control de Inventario</h3>
                            <p style={styles.featureDescription}>
                                Seguimiento en tiempo real de productos, alertas de stock bajo y gestión de proveedores
                                integrada.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>Ventas y Facturación</h3>
                            <p style={styles.featureDescription}>
                                Proceso de venta simplificado, múltiples formas de pago y generación automática de
                                facturas.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>Reportes Detallados</h3>
                            <p style={styles.featureDescription}>
                                Analítica avanzada, reportes personalizados y métricas clave para tomar mejores
                                decisiones.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>Gestión de Proveedores</h3>
                            <p style={styles.featureDescription}>
                                Administra tus proveedores, órdenes de compra y mantén un registro de todas las
                                transacciones.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>Seguridad Avanzada</h3>
                            <p style={styles.featureDescription}>
                                Protección de datos, múltiples niveles de acceso y respaldo automático de información.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;