import {Box} from '@components/box'
import {Text} from '@components/text'
import type {OnboardingStepPropsType} from './common'
import {
  OnboardingStep,
  OnboardingStepActions,
  OnboardingStepBody,
  OnboardingStepButton,
  OnboardingStepDescription,
  OnboardingStepTitle,
  ProfileInformationIcon,
  SecurityPackIcon,
} from './common'

export function Welcome({next}: OnboardingStepPropsType) {
  return (
    <OnboardingStep>
      <OnboardingStepTitle>Welcome to Mintter</OnboardingStepTitle>
      <OnboardingStepDescription>
        Joining Mintter is fast and easy, these are the only two steps you need
        to complete:
      </OnboardingStepDescription>
      <OnboardingStepBody
        css={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-evenly',
          width: '100%',
        }}
      >
        <WelcomeStep
          icon={<SecurityPackIcon />}
          title="1. Security Pack"
          description="Secure your identity in our peer-to-peer network"
        />
        <WelcomeStep
          icon={<ProfileInformationIcon />}
          title="2. Profile Information"
          description="Set up your profile providing an alias and an email"
        />
      </OnboardingStepBody>
      <OnboardingStepActions>
        <OnboardingStepButton onClick={next} data-testid="next-btn">
          Start
        </OnboardingStepButton>
      </OnboardingStepActions>
    </OnboardingStep>
  )
}

const WelcomeStep = ({
  icon,
  title,
  description,
}: {
  icon: JSX.Element
  title: string
  description: string
}) => {
  return (
    <Box
      css={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Box
        css={{
          alignItems: 'center',
          backgroundColor: '$primary-active',
          borderRadius: '50%',
          display: 'flex',
          height: 72,
          justifyContent: 'center',
          width: 72,
        }}
      >
        {icon}
      </Box>
      <Text alt size="7" css={{marginTop: '$6'}}>
        {title}
      </Text>
      <Text css={{marginTop: '$4', maxWidth: 228}}>{description}</Text>
    </Box>
  )
}
