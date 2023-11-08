type ApproveLeaveEmailProps = {
  leaveId: string;
  roName: string;
  staffName: string;
  duration: string;
  type: string;
  description: string | null;
  update: boolean;
  cancel: boolean;
};

const ApproveLeaveEmail = ({
  leaveId,
  roName = 'Syahir',
  staffName = 'Nas',
  duration = '10 October 2023 - 11 October 2023',
  type = 'Full Day',
  description = null,
  update,
  cancel,
}: ApproveLeaveEmailProps) => {
  const baseUrl = process.env['NEXTAUTH_URL'];

  const approveLeaveLink = `${baseUrl}/leaves?id=${leaveId}&mode=approve`;
  const rejectLeaveLink = `${baseUrl}/leaves?id=${leaveId}&mode=reject`;

  const content = `
    <html>
      <head></head>
      <body style="background-color: #ffffff; font-family: sans-serif; margin: auto;">
        <div style="border: 1px solid #eaeaea; border-radius: 40px; margin: 40px auto; padding: 20px; width: 550px;">
          <h1>Hi ${roName},</h1>
          ${
            update
              ? `<p>${staffName} has updated the request for a <b>${type}</b> leave on <b>${duration}</b>.</p>`
              : cancel
              ? `<p>${staffName} has cancelled the request for a <b>${type}</b> leave on <b>${duration}</b>.</p>`
              : `<p>${staffName} has requested for a <b>${type}</b> leave on <b>${duration}</b>.</p>`
          }
          ${
            !cancel
              ? `
            <p style="font-style: ${
              description ? 'normal' : 'italic'
            }; background-color: #F4F4F4; padding: 1rem; border-radius: 4px;">
              ${description ?? 'No Details were provided'}
            </p>
            <p>Please click the button below to approve or reject the request.</p>
            <div style="display: flex; justify-content: center; margin: 20px 0; width: 100%;">
              <a href="${approveLeaveLink}" style="background-color: #2563eb; border-radius: 40px; color: #ffffff; font-size: 16px; font-weight: bold; padding: 10px 20px; text-decoration: none; text-align: center; flex: 1;">Approve</a>
              <a href="${rejectLeaveLink}" style="background-color: #e00000; border-radius: 40px; color: #ffffff; font-size: 16px; font-weight: bold; margin-left: 10px; padding: 10px 20px; text-decoration: none; text-align: center; flex: 1;">Reject</a>
            </div>
          `
              : ''
          }
        </div>
      </body>
    </html>
  `;

  return content;
};

export default ApproveLeaveEmail;
