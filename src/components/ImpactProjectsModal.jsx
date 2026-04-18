import React from 'react';
import { COLOR } from '../constants';
import { useBreakpoint } from '../hooks/useBreakpoint';

const IMPACT_PROJECT_GROUPS = [
  {
    title: 'Community Care',
    projects: [
      'Neighborhood food banks and mobile pantry drives',
      'Safe shelter support for women, children, and displaced families',
      'Elder care visitation programs and companionship circles',
      'Community emergency response and relief hubs',
      'Household essentials distribution for vulnerable families',
      'Community kitchens and subsidized meal programs',
    ],
  },
  {
    title: 'Health Access',
    projects: [
      'Rural health outreaches and free screening clinics',
      'Maternal health education and support programs',
      'Mental health awareness campaigns and healing circles',
      'Disability support initiatives and assistive access projects',
      'Preventive health education for schools and informal settlements',
      'Blood drive coordination and hospital support programs',
    ],
  },
  {
    title: 'Education And Skills',
    projects: [
      'Scholarship funds and school supply drives',
      'Digital literacy bootcamps for youth and adults',
      'Vocational training for underserved communities',
      'Reading clubs, tutoring labs, and mentorship programs',
      'STEM labs and maker spaces for young learners',
      'Teacher support funds and classroom improvement drives',
    ],
  },
  {
    title: 'Environment',
    projects: [
      'Community clean-up activations and recycling systems',
      'Tree planting and urban greening programs',
      'Sustainable farming and climate resilience initiatives',
      'Water access and sanitation improvement projects',
      'Plastic recovery and circular economy projects',
      'Clean energy access for schools, clinics, and small communities',
    ],
  },
  {
    title: 'Youth And Work',
    projects: [
      'Youth leadership cohorts and civic participation programs',
      'Career readiness workshops and job placement support',
      'Creative incubators for makers, artists, and founders',
      'Sports and wellness programs that build confidence and belonging',
      'Apprenticeship pipelines with local businesses and mentors',
      'Youth-led social enterprise accelerators',
    ],
  },
  {
    title: 'Culture And Inclusion',
    projects: [
      'Arts festivals that celebrate local stories and identity',
      'Inclusive spaces for interfaith and inter-community dialogue',
      'Programs for migrants, minorities, and marginalized groups',
      'Accessibility-first events and public participation initiatives',
      'Community storytelling archives and oral history projects',
      'Safe spaces for girls, women, and underrepresented voices',
    ],
  },
  {
    title: 'Food Security',
    projects: [
      'Community farms and cooperative growing systems',
      'Nutrition education for parents and caregivers',
      'School feeding programs with transparent donor support',
      'Food rescue networks connecting surplus to need',
      'Urban garden activations in churches, schools, and estates',
      'Market voucher support for families in crisis periods',
    ],
  },
  {
    title: 'Faith And Mission',
    projects: [
      'Church-led outreach events with measurable community care goals',
      'Mission trips tied to local long-term development partnerships',
      'Faith-based counseling and restoration programs',
      'Volunteer teams serving prisons, shelters, and hospitals',
      'Compassion funds for urgent family support and intervention',
      'Local partnerships between ministries and grassroots nonprofits',
    ],
  },
  {
    title: 'Women And Family',
    projects: [
      'Support circles for single mothers and caregivers',
      'Family strengthening workshops and parenting programs',
      'Women entrepreneurship collectives and funding support',
      'Protection, dignity, and reintegration support for survivors',
      'Childcare access models that unlock work and learning',
      'Back-to-school campaigns focused on girls and at-risk children',
    ],
  },
  {
    title: 'Housing And Safety',
    projects: [
      'Community repair projects for unsafe homes and shared spaces',
      'Temporary shelter coordination after displacement or disaster',
      'Public safety lighting and neighborhood watch initiatives',
      'Sanitation and dignity infrastructure in underserved areas',
      'Safe transit coordination for vulnerable groups and event access',
      'Resilience planning for flood-prone and high-risk communities',
    ],
  },
  {
    title: 'Digital Inclusion',
    projects: [
      'Community Wi-Fi access projects for learning and coordination',
      'Low-cost device access for students and nonprofit workers',
      'Digital identity and onboarding support for excluded communities',
      'Tech-for-good tools for organizers, volunteers, and donors',
      'Civic data collection for accountability and service delivery',
      'Online safety and digital rights education initiatives',
    ],
  },
];

export default function ImpactProjectsModal({ onClose, onPartner }) {
  const { isMobile } = useBreakpoint();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 320,
        background: 'rgba(10,22,40,0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'max(12px, env(safe-area-inset-top)) 12px max(16px, env(safe-area-inset-bottom))',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#f0f2ff',
          borderRadius: 24,
          width: 'min(780px, 100%)',
          maxHeight: 'calc(100dvh - 24px)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(10,22,40,0.25)',
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: '#0A1628',
            color: '#fff',
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div
          style={{
            overflowY: 'auto',
            padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 36px) 24px',
          }}
        >
          <div
            style={{
              height: isMobile ? 72 : 120,
              borderRadius: 16,
              marginBottom: 22,
              background: 'radial-gradient(circle at 16% 35%, rgba(20,217,196,0.2) 0%, transparent 34%), radial-gradient(circle at 78% 55%, rgba(10,22,40,0.14) 0%, transparent 42%), #e6ebff',
              border: '1px solid rgba(10,22,40,0.08)',
            }}
          />

          <h3 style={{ margin: '0 0 8px', color: '#0A1628', fontSize: isMobile ? 24 : 30, fontWeight: 800, lineHeight: 1.15 }}>
            Impact Projects We Would Love To See
          </h3>
          <p style={{ margin: '0 0 24px', color: '#42506a', fontSize: 14, lineHeight: 1.75, maxWidth: 620 }}>
            This list is intentionally broad. We want to support projects that improve lives, build trust, strengthen communities, and create measurable social good over time.
          </p>
          <p style={{ margin: '0 0 24px', color: '#5d6a83', fontSize: 13, lineHeight: 1.7, maxWidth: 640 }}>
            If your vision sits anywhere in or around these categories, it is worth a conversation. We care about substance, consistency, and real community value more than polished branding.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
              gap: 14,
            }}
          >
            {IMPACT_PROJECT_GROUPS.map((group, index) => (
              <div
                key={group.title}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(10,22,40,0.08)',
                  borderRadius: 18,
                  padding: '18px 18px 16px',
                  boxShadow: '0 10px 24px rgba(10,22,40,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(20,217,196,0.16)',
                      color: '#0A1628',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p style={{ margin: 0, color: '#0A1628', fontSize: 16, fontWeight: 800 }}>
                    {group.title}
                  </p>
                </div>

                <div style={{ display: 'grid', gap: 10 }}>
                  {group.projects.map((project) => (
                    <div key={project} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: COLOR,
                          marginTop: 7,
                          flexShrink: 0,
                        }}
                      />
                      <p style={{ margin: 0, color: '#4b5974', fontSize: 13, lineHeight: 1.7 }}>
                        {project}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: isMobile ? '14px 16px calc(14px + env(safe-area-inset-bottom))' : '16px 36px calc(16px + env(safe-area-inset-bottom))',
            background: 'rgba(240,242,255,0.98)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(10,22,40,0.08)',
          }}
        >
          <button
            onClick={onPartner}
            style={{
              width: '100%',
              background: '#0A1628',
              color: '#fff',
              border: 'none',
              borderRadius: 50,
              padding: '14px 20px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              letterSpacing: 0.3,
              fontFamily: 'inherit',
            }}
          >
            Partner With Us →
          </button>
        </div>
      </div>
    </div>
  );
}
