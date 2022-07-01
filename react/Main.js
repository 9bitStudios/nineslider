import {Nineslider} from './nineslider/Nineslider';

var data = [
    {
        image: "../images/1.jpg",
        link: "https://github.com/9bitStudios/nineslider",
        caption: 'This is a caption'
    },
    {
        image: "../images/2.jpg",
        link: "",
        caption: 'This is another caption with <a href="https://github.com/9bitStudios/nineslider" target="_blank">a link</a>'
    },
    {
        image: "../images/3.jpg",
        link: "",
        caption: null
    },
    {
        image: "../images/4.jpg",
        link: "",
        caption: null
    }                            
];   

var settings = {
    autoPlay: {
        enable: true,
        interval: 5000,
        pauseOnHover: false
    },
    loaded: function() { console.log('loaded'); },
    before: function() { console.log('before'); },
    after: function() { console.log('after'); }
}

ReactDOM.render(<Nineslider data={data} settings={settings} />, document.getElementById('content'));