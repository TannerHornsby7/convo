import { useToastState, Toast } from '@tamagui/toast';
import { YStack } from 'tamagui';

const AlertToast = () => {
    const currentToast = useToastState()
  
    if (!currentToast || currentToast.isHandledNatively) return null
    return (
      <Toast
        key={currentToast.id}
        duration={currentToast.duration}
        enterStyle={{ opacity: 0, scale: 0.5 }}
        exitStyle={{ opacity: 0, scale: 1 }}
        opacity={1}
        scale={1}
        animation="100ms"
        viewportName={currentToast.viewportName}
      >
        <YStack>
          <Toast.Title>{currentToast.title}</Toast.Title>
          {!!currentToast.message && (
            <Toast.Description>{currentToast.message}</Toast.Description>
          )}
        </YStack>
      </Toast>
    )
  }

export default AlertToast;