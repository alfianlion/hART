import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Body } from '@react-email/body';

type ApproveRejectResultEmailProps = {
  roName: string;
  staffName: string;
  duration: string;
  type: string;
  description: string | null;
  typeOfEmail: 'approve' | 'reject';
};

const ApproveRejectResultEmail = ({
  roName = 'Syahir',
  staffName = 'Nas',
  duration = '10 October 2023 - 11 October 2023',
  type = 'Full Day',
  description = null,
  typeOfEmail,
}: ApproveRejectResultEmailProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: '#ffffff',
          fontFamily: 'sans-serif',
          margin: 'auto',
        }}
      >
        <div
          style={{
            border: '1px solid #eaeaea',
            borderRadius: '40px',
            margin: '40px auto',
            padding: '20px',
            width: '550px',
          }}
        >
          <h1>Hi {staffName},</h1>
          {typeOfEmail === 'reject' ? (
            <p>
              {roName} has <b>rejected</b> your leave request on{' '}
              <b>{duration}</b> (<b>{type}</b>)
            </p>
          ) : (
            <p>
              {roName} has <b>approved</b> your leave request on{' '}
              <b>{duration}</b> (<b>{type}</b>)
            </p>
          )}
          {typeOfEmail === 'reject' && (
            <p
              style={{
                fontStyle: description ? 'normal' : 'italic',
                backgroundColor: '#F4F4F4',
                padding: '1rem',
                borderRadius: '4px',
              }}
            >
              {description ?? <i>'No Details were provided'</i>}
            </p>
          )}
        </div>
      </Body>
    </Html>
  );
};

export default ApproveRejectResultEmail;
