import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Body } from '@react-email/body';
import { Preview } from '@react-email/preview';
import { Button } from '@react-email/Button';

type ApproveLeaveEmailProps = {
  leaveId: string;
  roName: string;
  staffName: string;
  duration: string;
  type: string;
  description: string | null;
};

const ApproveLeaveEmail = ({
  leaveId,
  roName = 'Syahir',
  staffName = 'Nas',
  duration = '10 October 2023 - 11 October 2023',
  type = 'Full Day',
  description = null,
}: ApproveLeaveEmailProps) => {
  const baseUrl = 'http://localhost:3000';
  // process.env['NODE_ENV'] === 'production' ? 'TODO' : 'http://localhost:3000';

  const approveLeaveLink = `${baseUrl}/leaves/${leaveId}/approve`;
  const rejectLeaveLink = `${baseUrl}/leaves/${leaveId}/reject`;

  return (
    <Html>
      <Head />
      <Preview>
        Approve Leave Request by {staffName} ({type}) on {duration}
      </Preview>
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
          <h1>Hi {roName},</h1>
          <p>
            {staffName} has requested for a <b>{type}</b> leave on{' '}
            <b>{duration}</b>.
          </p>
          <p
            style={{
              fontStyle: description ? 'normal' : 'italic',
              backgroundColor: "#F4F4F4",
              padding: '1rem',
              borderRadius: '4px'
            }}
          >
            {description ?? 'No Details were provided'}
          </p>
          <p>Please click the button below to approve or reject the request.</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '20px 0',
              width: '100%',
            }}
          >
            <Button
              style={{
                backgroundColor: '#2563eb',
                borderRadius: '40px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '10px 20px',
                textDecoration: 'none',
                textAlign: 'center',
                flex: 1,
              }}
              href={approveLeaveLink}
            >
              Approve
            </Button>
            <Button
              style={{
                backgroundColor: '#e00000',
                borderRadius: '40px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
                marginLeft: '10px',
                padding: '10px 20px',
                textDecoration: 'none',
                textAlign: 'center',
                flex: 1,
              }}
              href={rejectLeaveLink}
            >
              Reject
            </Button>
          </div>
        </div>
      </Body>
    </Html>
  );
};

export default ApproveLeaveEmail;
