'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import JobCard from './JobCard';
import type { Job } from '@/lib/fetchJobs';

type Props = {
  jobs: Job[];
};

export default function RecommendationsCarousel({ jobs }: Props) {
  return (
    <Swiper
      modules={[Navigation, A11y]}
      navigation
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {jobs.map((job, idx) => (
        <SwiperSlide key={idx}>
          <JobCard
            title={job.job_title}
            company={job.employer_name}
            location={job.job_city || job.job_country || '—'}
            logoUrl={job.employer_logo}
            onApply={() => window.open(job.job_apply_link, '_blank')}
            onSave={() => alert(`Saved: ${job.job_title}`)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
