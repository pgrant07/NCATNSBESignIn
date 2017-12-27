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
        this.lastName=lastName;
        this.major=major;
        this.classification=classification;
        this.email=email;
        this.slack=slack;
    }

    let searchDB=new Promise(function(resolve, reject){
        let firebaseRef=firebase.database().ref();
        let studentRef=firebaseRef.child('Students');
        let query=studentRef.orderByChild('email').equalTo(memEmail).limitToFirst(1);
        let emailFound=false;

        query.on('value', snapshot=>{
            console.log('email found');
            emailFound=true;
        });

        if(emailFound==true){
            resolve(emailFound);
        }     
        else{
            reject(alert('Email not found in database. Please enter in information under the new member sign-in'));
        }
    });

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
        let firebaseRef=firebase.database().ref();
        firebaseRef.child("Students").push(newStudent);
    }

    /**
     * Checks the user's validated email to see if it exists in the database
     *
     * @param {string} em the email of the user to be checked
     */
    function isEmailInDatabase(em){
        
        /*
        studentRef.once('value', function(snapshot){
            snapshot.forEach(function(childSnapshot){
                let childKey=childSnapshot.key;
                let childData=childSnapshot.val();
                console.log(childData);
                if(childData.email==em){
                    console.log('This email is in the database');
                    emailFound=true;
                    return true;
                }
            });
            console.log(snapshot);
            //return emailFound;
        });
        */
        //console.log(emailFound)
        return emailFound;
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
        //console.log(checkEmail(memEmail));
        searchDB.then(alert('Email found in database. Thank you for signing in'))
        // if(!isEmailInDatabase(memEmail)){
        //     alert('Email is not found in database. Please sign in below');
        // }

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

        if(firstName==null ||firstName==''){
            alert('Please fill out first name');
            return false;
        }
        if(lastName=null || lastName==''){
            alert('Please fill out last name');
            return false;
        }
        if(major==null || major==''){
            alert('Please indicate major');
            return false;
        }
        if(classification==null || classification==''){
            alert('Please indicate classification');
            return false;
        }
        if(major==null || major==''){
            alert('Please indicate major');
            return false;
        }
        if(!email.endsWith('@aggies.ncat.edu') || email.length<17){
            alert('Please enter a valid email address');
            return false;
        }
        if(slack==null || slack==''){
            alert('Please indicate Slack status');
            return false;
        }
        createStudent(firstName, lastName, major, classification, email, slack);


    });
});
