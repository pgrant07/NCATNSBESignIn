$(document).ready(function(){
    let memEmail;
    
    /**
    * Constructor for Student object
    *
    * @param {string} firstName first name of student
    * @param {string} lastName last name of student
    * @param {string} major major of student
    * @param {string} classification classification of student
    * @param {string} email Aggie email of student
    * @param {string} slack the Student's slack status (whether they want to be
    * be in the Slack, they don't want to be in the Slack, or they are already
    * in the Slack)
    */
    function Student(firstName, lastName, major, classification, email, slack){
        this.firstName=firstName;
        console.log(lastName);
        this.lastName=lastName;
        this.major=major;
        this.classification=classification;
        this.email=email;
        this.slack=slack;
    }
        
        
        
    /**
    * creates new student and adds them to Firebase database
    *
    * @param {string} firstName first name of student
    * @param {string} lastName last name of student
    * @param {string} major major of student
    * @param {string} classification classification of student
    * @param {string} email Aggie email of student
    * @param {string} slack the Student's slack status (whether they want to be
    */
    function createStudent(firstName, lastName, major, classification, email, slack){
        let newStudent=new Student(firstName, lastName, major, classification, email, slack);
        console.log(newStudent);
        username=newStudent.email.replace('@aggies.ncat.edu','');
        let firebaseRef=firebase.database().ref();
        firebaseRef.child('Students/'+username).set(newStudent);
    }
            
    /**
    * Checks the user's validated email to see if it exists in the database
    *
    * @param {string} em the email of the user to be checked
    */
    function isEmailInDatabase(em){
        let firebaseRef=firebase.database().ref();
        let studentRef=firebaseRef.child('Students');
        let emailFound=false;
        const username = memEmail.replace('@aggies.ncat.edu','');
        //console.log(username);
        return studentRef.orderByKey().equalTo(username).once('value').then(function(snapshot){
            snapshot.forEach(function(data){
                if(data.key === username){
                    emailFound=true;  
                }
            });
            return verifyEmail(emailFound);
        });
    }
            
    /**
    * Verifies if an email is in the database and displays to the user
    * @param {boolean} emailFound whether the email has been found in the firebase database
    *
    */
    function verifyEmail(emailFound){
        if(emailFound){
            return 'Email found in database. Thank you for signing in';
        }else{
            return 'Email was not found in the database. Please sign in below';
        }
    }

    /**
    * When a member has entered their email it is verified to see if it is an
    * Aggie email. If it is a valid email, there is a check to see if the email
    * exists in the database meaning the user has previously signed in before.
    *
    * @return {boolean} false if the email is not validated
    */
    $('#memForm').on('submit', function(e){
        e.preventDefault();
                
        memEmail=$('#memEmail').val();
        if(!memEmail.endsWith('@aggies.ncat.edu') || memEmail.length<17){
            alert('Please enter in a valid email address');
            return false;
        }
        
        // let searchDB=new Promise(function(resolve, reject)
        isEmailInDatabase(memEmail).then(function(result){
            console.log(result);
        })
    });
            
    /**
    * Once the form has been submitted, the entries are checked to see if they
    * are valid entries. If any of the entries are not valid, an alert message
    * will appear. If all of the entries are valid entries, the form will be
    * submitted and the student added to the Firebase database
    *
    * @return {boolean} false if the user input is not valid
    */
    $('#form').on('submit', function(e){
        e.preventDefault();
        let firstName=$('#firstname').val();
        let lastName=$('#lastname').val();
        let major=$('#major').val();
        let classification=$('#classification').val();
        let email=$('#email').val();;
        let slack=$('#slack').val();
        //check if first name is blank
        if(firstName===null || firstName===''){
            alert('Please fill out first name');
            return false;
        }
        //check if last name is blank
        if(lastName===null || lastName===''){
            alert('Please fill out last name');
            return false;
        }
        //check if major is blank
        if(major===null || major===''){
            alert('Please indicate major');
            return false;
        }
        //check if classification is selected
        if(classification===null || classification===''){
            alert('Please indicate classification');
            return false;
        }
        //check if email is valid
        if(!email.endsWith('@aggies.ncat.edu') || email.length<17){
            alert('Please enter a valid email address');
            return false;
        }
        //check if slack status is indicated
        if(slack===null || slack===''){
            alert('Please indicate Slack status');
            return false;
        }
                
        //create new student
        createStudent(firstName, lastName, major, classification, email, slack);
                
        //Clear form
        document.querySelector('#firstname').value='';
        document.querySelector('#lastname').value='';
        document.querySelector('#major').value='';
        document.querySelector('#classification').value='';
        document.querySelector('#email').value='';
        document.querySelector('#slack').value='';
    });
});
        