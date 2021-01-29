function quize(){
    let titleId = document.getElementById('title');
    let questionId = document.getElementById('msg');
    let answersContainer = document.getElementById('answer');
    let genreId = document.getElementById('genre');
    let difficultyId = document.getElementById('difficulty');

    //設定
    const quizeState = {
        quizzes : [],
        currentIndex : 0,
        numberOfCorrects : 0
    };

    const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
    getQuizData();

    function getQuizData(){
        titleId.textContent = '取得中'
        questionId.textContent = '少々お待ち下さい'
        start.hidden = true;

        fetch(API_URL)
            .then(response => response.json())
            .then((data) => {
                quizeState.quizzes = data.results;
                quizeState.currentIndex = 0;
                quizeState.numberOfCorrects = 0;
    
                setNextQuiz();
            });
    }

    const setNextQuiz = function() {
        // 問題文と解答を空にしてから、次の問題 or 結果を表示
        questionId.textContent = '';
        removeAllAnswers();
        if(quizeState.currentIndex < quizeState.quizzes.length) {
          const quiz = quizeState.quizzes[quizeState.currentIndex];
          makeQuiz(quiz);
        } else {
          finishQuiz();
        }
      };
    
    const finishQuiz = function () {
        titleId.textContent = `あなたの点数は${quizeState.numberOfCorrects}/${quizeState.quizzes.length} 点です`;
        questionId.textContent = '再度開始する場合は開始ボタンをおして下さい';
        genreId.hidden = true;
        difficultyId.hidden = true;
        start.hidden = false;
    };

    const removeAllAnswers = function() {
        while (answersContainer.firstChild) {
            answersContainer.removeChild( answersContainer.firstChild );
        }
    };

    const makeQuiz = (quiz) => {
      // シャッフル済みの解答一覧を取得する
      const answers = buildAnswers(quiz);

      // 問題文のセット
      questionId.textContent = unescapeHTML(quiz.question);
      quizNum = quizeState.currentIndex + 1;
      titleId.textContent = '問題' + quizNum;
      genreId.textContent = '[ジャンル] ' + quiz.category;
      difficultyId.textContent = '[難易度] ' + quiz.difficulty;
    
      // 解答一覧をセット
      answers.forEach((answer) => {
        const liElement = document.createElement('li');
        const btnElement = document.createElement('button');
        liElement.appendChild(btnElement);
        btnElement.textContent = unescapeHTML(answer);
        answersContainer.appendChild(liElement);
    
        // 解答を選択したときの処理
        liElement.addEventListener('click', (event) => {
          unescapedCorrectAnswer = unescapeHTML(quiz.correct_answer);
          if (event.target.textContent === unescapedCorrectAnswer) {
            quizeState.numberOfCorrects++;
          } 
    
          quizeState.currentIndex++;
          setNextQuiz();
        });
      });
    };

    const buildAnswers = function(quiz) {
        const answers = [
          quiz.correct_answer,
          ...quiz.incorrect_answers
        ];
    
        return answers;
    };

    const unescapeHTML = (str) => {
        const div = document.createElement("div");
        div.innerHTML = str.replace(/</g,"&lt;")
                           .replace(/>/g,"&gt;")
                           .replace(/ /g, "&nbsp;")
                           .replace(/\r/g, "&#13;")
                           .replace(/\n/g, "&#10;");
    
        return div.textContent || div.innerText;
    };
}

let start = document.getElementById('start');
start.addEventListener('click', (event) => {
    quize();
});



