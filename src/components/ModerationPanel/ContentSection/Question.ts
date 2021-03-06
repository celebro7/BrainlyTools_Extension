import type { QuestionDataInTicketType } from "@BrainlyAction";
import { Counter, Flex, Icon, Label, Text } from "@style-guide";
import type ModerationPanelClassType from "../ModerationPanel";
import ContentSection from "./ContentSection";
import QuickActionButtonsForQuestion from "./QuickActionButtons/Question";

export default class Question extends ContentSection {
  questionData: QuestionDataInTicketType;
  extraData: {
    id: string;
    isPopular: boolean;
    answers: {
      hasVerified: boolean;
    };
  };

  constructor(main: ModerationPanelClassType) {
    super(main, "Question");

    this.questionData = this.main.data.task;
    this.data = this.questionData;

    this.SetOwner();
    this.Render();
    this.RenderUserDetails();
    this.RenderContentDetails();
    // this.RenderPopularIcon();
    this.RenderQuickActionButtons();
  }

  RenderUserDetails() {
    const subjectData = System.data.Brainly.defaultConfig.config.data.subjects.find(
      subject => subject.id === this.questionData.subject_id,
    );
    const gradeData = System.data.Brainly.defaultConfig.config.data.grades.find(
      grade => grade.id === this.questionData.grade_id,
    );

    // const subjectLink = System.createBrainlyLink();

    this.userDetailsContainer.RenderChildren(
      Text({
        tag: "span",
        size: "xsmall",
        color: "gray-secondary",
        text: subjectData.name,
      }),
      Text({
        tag: "span",
        size: "xsmall",
        color: "gray-secondary",
        text: gradeData.name,
      }),
    );
  }

  RenderContentDetails() {
    this.contentDetailsContainer.append(
      Flex({
        marginLeft: "xs",
        children: Counter({
          icon: "points",
          children: [
            `+${this.questionData.points.ptsForResp} `,
            Text({
              tag: "span",
              size: "small",
              weight: "bold",
              color: "gray-secondary",
              text: System.data.locale.common.shortPoints.toLowerCase(),
            }),
          ],
        }),
      }),
    );
  }

  RenderQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForQuestion(this);

    this.contentContainer.append(this.quickActionButtons.container);
  }

  RenderExtraDetails() {
    this.quickActionButtons.RenderDeleteButtons();
    this.RenderPopularLabel();
  }

  RenderPopularLabel() {
    if (!this.extraData.isPopular) return;

    this.contentDetailsContainer.append(
      Flex({
        marginLeft: "xs",
        children: new Label({
          type: "transparent",
          title: System.data.locale.reportedContents.queue.popularQuestion,
          icon: new Icon({
            type: "friends",
            color: "blue",
          }),
        }),
      }),
    );
  }
}
