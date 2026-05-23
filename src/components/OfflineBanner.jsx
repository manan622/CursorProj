import { useOnlineStatus } from '../hooks/useOnlineStatus'
import styled from 'styled-components'

const OfflineIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ff6b6b;
  color: white;
  padding: 12px 24px;
  text-align: center;
  font-weight: 500;
  z-index: 9999;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus()

  if (isOnline) {
    return null
  }

  return (
    <OfflineIndicator>
      📡 You are offline. Some features may not be available.
    </OfflineIndicator>
  )
}
