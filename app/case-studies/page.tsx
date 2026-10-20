"use client";
import CaseStudiesPage from "@/components/CaseStudiesPage";
import CasesD from "@/components/cases/CasesD";

/** Cases as a split view: the list of cases on the left, one full story on the right. */
export default function CaseStudies() {
  return <CaseStudiesPage cases={<CasesD />} />;
}
