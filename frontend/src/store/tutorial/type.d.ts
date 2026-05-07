interface TutorialState {
  loginTutorialCompleted: boolean;
  homeTutorialCompleted: boolean;
  projectTutorialCompleted: boolean;
  setLoginTutorialCompleted: (completed: boolean) => void;
  setHomeTutorialCompleted: (completed: boolean) => void;
  setProjectTutorialCompleted: (completed: boolean) => void;
}
