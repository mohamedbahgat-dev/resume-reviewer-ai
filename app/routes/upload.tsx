import React from 'react';
import { useState } from 'react';
import NavBar from '~/components/NavBar';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '../../constants';


interface FileAnalyzerProps {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File
}

interface FormDataProps {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}


const Upload = () => {
  const {auth, isLoading, fs, ai, kv} = usePuterStore();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file)
  }

  const handleAnalyzeData = async ({companyName, jobTitle, jobDescription , file} : FileAnalyzerProps) => {
    setIsProcessing(true);
    setStatusText('Uploading the file...');
    const uploadedFile = await fs.upload([file])

    if(!uploadedFile) return setStatusText('No file uploaded') ;

    setStatusText('Converting to image ...');
    const imageFile = await convertPdfToImage(file)

    if(!imageFile.file) return setStatusText('Failed to convert PDf to image...') ;

    setStatusText('Uploading the image ...');
    const uploadedImage = await fs.upload([imageFile.file])
    if(!uploadedImage) return setStatusText('Error: failed  to upload image.') ;

    setStatusText('Preparing data...');

    const uuid = generateUUID();

    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName, jobTitle, jobDescription,
      feedback: ''
    }

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText('Analyzing data...');

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle , jobDescription })
    )

    if(!feedback) return setStatusText('Error: failed  to analyze data... ') ;

    const feedbackText = typeof  feedback.message.content === 'string'
      ? feedback.message.content
      : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText)
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText('Analysis completed, redirecting...')

  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if(!form) return;

    const formData = new FormData(form);
    const companyName = formData.get('company-name') as string;
    const jobTitle  = formData.get('job-title') as string;
    const jobDescription  =  formData.get('job-description') as string;

    if(!file) return;

    handleAnalyzeData({companyName, jobTitle, jobDescription, file})
  }



  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <NavBar />

      <section className='main-section'>
       <div className='page-heading'>
         <h1>Get instant AI feedback for your resume</h1>
         {isProcessing ? (
           <div>
             <h2>{statusText}</h2>
             <img src='/images/resume-scan.gif' alt='resume scanning' className='w-full' />
           </div>
         ) : (
         <h2>Upload you resume for AST and smart scoring analysis</h2>
         )}
         {!isProcessing &&
           <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4'>
             <div className = 'form-div'>
               <label htmlFor='company-name'>Company Name</label>
               <input name='company-name' type='text' placeholder='Company Name' id='company-name' />
             </div>
             <div className = 'form-div'>
               <label htmlFor='job-title'>Job Title</label>
               <input name='job-title' type='text' placeholder='Job Title' id='job-title' />
             </div>
             <div className = 'form-div'>
               <label htmlFor='job-description'>Job Description</label>
               <textarea name='job-description' rows={5} placeholder='write a clear an concious job description' id='job-description' />
             </div>
             <div className = 'form-div'>
               <label htmlFor='uploader'>Upload Resume</label>
                 <FileUploader  onFileSelect={handleFileSelect}/>
             </div>
             <button type='submit' className='primary-button '>Examine Resume</button>
           </form>
         }
       </div>
      </section>
    </main>

      );
};

export default Upload;