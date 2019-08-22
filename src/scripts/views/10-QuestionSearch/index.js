import WaitForElement from "../../helpers/WaitForElement";
import WaitForObject from "../../helpers/WaitForObject";
import ModerateSection from "./_/ModerateSection";
import QuestionBox from "./_/QuestionBox";

System.pageLoaded("Question search page OK!");

export class QuestionSearch {
  constructor() {
    /**
     * @type {Object<number, QuestionBox>}
     */
    this.questionBoxList = {};

    this.Init();

    if (System.checkUserP([14, 26]))
      this.moderateSection = new ModerateSection(this);
  }
  async Init() {
    try {
      if (System.checkUserP([1, 14, 26]) && System.checkBrainlyP(102)) {
        let _$_observe = await WaitForObject("$().observe");

        if (_$_observe) {
          this.searchResults = await WaitForElement(".js-react-search-results");

          if (this.searchResults && this.searchResults.length > 0) {
            this.ObserveResults();

            let questionBoxContainer = await WaitForElement(".sg-layout__box");

            this.PrepareQuestionBoxes(questionBoxContainer[0]);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  ObserveResults() {
    $(this.searchResults).observe('childlist', ".sg-layout__box", event => {
      if (event.addedNodes && event.addedNodes.length > 0) {
        this.PrepareQuestionBoxes(event.addedNodes[0]);
      }
    });
  }
  /**
   * @param {HTMLElement} element
   */
  PrepareQuestionBoxes(element) {
    let $questions = $(`[data-test="search-stream-wrapper"] > .sg-content-box.sg-content-box--spaced-top-large`, element);

    if ($questions.length > 0 && !element.classList.contains("quickDelete")) {
      this.element = element;

      element.classList.add("quickDelete");
      this.moderateSection.Show();

      $questions.each((i, $question) => this.InitQuestionBox($question));
    }
  }
  /**
   * @param {HTMLElement} question
   */
  InitQuestionBox(question) {
    let $seeAnswerLink = $(".sg-content-box__actions > .sg-actions-list a", question);
    let id = System.ExtractId($seeAnswerLink.attr("href"));
    /**
     * @type {QuestionBox}
     */
    let questionBox = this.questionBoxList[id];
    console.log(this.questionBoxList);

    if (!questionBox) {
      questionBox = this.questionBoxList[id] = new QuestionBox(this, question, id);
      questionBox.$checkBox.change();
    } else {
      questionBox.$ = $(question);

      questionBox.RenderQuestionOwner();
      questionBox.ShowSelectBox();
      questionBox.ShowQuickDeleteButtons();
      questionBox.CheckIsDeleted();
    }
  }
}

new QuestionSearch();
