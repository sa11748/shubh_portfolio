import React, { useEffect, useState, useContext } from 'react';
import { Chrono } from 'react-chrono';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Fade from 'react-reveal';
import { ThemeContext } from 'styled-components';
import endpoints from '../constants/endpoints';
import Header from './Header';
import FallbackSpinner from './FallbackSpinner';
import '../css/education.css';

function Education({ header }) {
  const theme = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: '50vw',
    mode: 'VERTICAL_ALTERNATING',
  });

  useEffect(() => {
    // Fetch education data
    const fetchEducationData = async () => {
      try {
        const response = await fetch(endpoints.education, { method: 'GET' });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };

    fetchEducationData();

    // Resize handler for responsive dimensions
    const handleResize = () => {
      const { innerWidth } = window;
      if (innerWidth < 576) {
        setDimensions({ width: '90vw', mode: 'VERTICAL' });
      } else if (innerWidth >= 576 && innerWidth < 768) {
        setDimensions({ width: '90vw', mode: 'VERTICAL_ALTERNATING' });
      } else if (innerWidth >= 768 && innerWidth < 1024) {
        setDimensions({ width: '75vw', mode: 'VERTICAL_ALTERNATING' });
      } else {
        setDimensions({ width: '50vw', mode: 'VERTICAL_ALTERNATING' });
      }
    };

    // Initial resize check and event listener
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    // Cleanup event listener on unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return (
    <>
      <Header title={header} />
      {data ? (
        <Fade>
          <div style={{ width: dimensions.width }} className="section-content-container">
            <Container>
              <Chrono
                hideControls
                allowDynamicUpdate
                useReadMore={false}
                items={data?.education || []}
                cardHeight={250}
                mode={dimensions.mode}
                theme={{
                  primary: theme.accentColor,
                  secondary: theme.accentColor,
                  cardBgColor: theme.chronoTheme.cardBgColor,
                  cardForeColor: theme.chronoTheme.cardForeColor,
                  titleColor: theme.chronoTheme.titleColor,
                }}
              >
                <div className="chrono-icons">
                  {data?.education?.map((education) =>
                    education.icon ? (
                      <img
                        key={education.icon.src}
                        src={education.icon.src}
                        alt={education.icon.alt}
                      />
                    ) : null
                  )}
                </div>
              </Chrono>
            </Container>
          </div>
        </Fade>
      ) : (
        <FallbackSpinner />
      )}
    </>
  );
}

Education.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Education;
