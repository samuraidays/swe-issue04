function main(){
    let title = document.getElementById('title');
    let questionId = document.getElementById('msg');
    let answersContainer = document.getElementById('answer');
    let genre = document.getElementById('genre');
    let difficulty = document.getElementById('difficulty');

    //設定
    const quizeState = {
        quizzes : [],
        currentIndex : 0,
        numberOfCorrects : 0
    };

    const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
    getQuizData();

    function getQuizData(){
        title.textContent = '取得中'
        questionId.textContent = '少々お待ち下さい'
        start.style.display ="none";

        fetch(API_URL)
            .then(response => response.json())
            .then((data) => {
                // クイズデータを取得したら、gameState内の情報をリセットする
                quizeState.quizzes = data.results;
                quizeState.currentIndex = 0;
                quizeState.numberOfCorrects = 0;
    
                // 一通りクイズに必要な情報を手に入れたのでクイズを開始する。
                setNextQuiz();
            });
    }

    const setNextQuiz = function() {
        // 問題文と解答を空にしてから、次の問題 or 結果を表示
        questionId.textContent = '';
        //removeAllAnswers();
        console.log(quizeState.currentIndex + '<' + quizeState.quizzes.length);
        if(quizeState.currentIndex < quizeState.quizzes.length) {
          const quiz = quizeState.quizzes[quizeState.currentIndex];
          makeQuiz(quiz);
        } else {
          finishQuiz();
        }
      };
    
    const finishQuiz = function () {
        questionId.textContent = `XXX点`;
        console.log("終わり")
        start.hidden = false;
    };

/*     const removeAllAnswers = function() {
        console.log(answersContainer.firstChild)
        while (answersContainer.firstChild) {
            answersContainer.removeChild( answersContainer.firstChild );
        }
    }; */

    const makeQuiz = function(quiz) {
        // シャッフル済みの解答一覧を取得する
        const answers = buildAnswers(quiz);
        // 問題文のセット
        questionId.textContent = unescapeHTML(quiz.question);
        console.log(questionId.textContent)
    
        // 解答一覧をセット
        answers.forEach((answer) => {
          const liElement = document.createElement('button');
          liElement.textContent = unescapeHTML(answer);
          answersContainer.appendChild(liElement);
    
           liElement.addEventListener('click', (event) => {
            unescapedCorrectAnswer = unescapeHTML(quiz.correct_answer);
            if (event.target.textContent === unescapedCorrectAnswer) {
              quizeState.numberOfCorrects++;
              alert('Correct answer!!');
            } else {
              alert(`Wrong answer... (The correct answer is "${unescapedCorrectAnswer}")`);
            }})
    
            quizeState.currentIndex++;
            setNextQuiz();
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
    main();
});