import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface CertificateData {
  id: string;
  course_name: string;
  score: number;
  issued_at: string;
  certificate_number: string;
}

const VerifyCertificate = () => {
  const { certificateNumber } = useParams<{ certificateNumber: string }>();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyCertificate = async () => {
      if (!certificateNumber) {
        setError(true);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("skill_certificates")
        .select("id, course_name, score, issued_at, certificate_number")
        .eq("certificate_number", certificateNumber)
        .single();

      if (fetchError || !data) {
        setError(true);
      } else {
        setCertificate(data);
      }
      setLoading(false);
    };

    verifyCertificate();
  }, [certificateNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Verifying certificate...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {error ? (
          <div className="p-8 rounded-2xl bg-red-500/10 border-2 border-red-500/50 text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Certificate Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The certificate with number "{certificateNumber}" could not be verified.
              It may be invalid or does not exist.
            </p>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
          </div>
        ) : certificate ? (
          <div className="p-8 rounded-2xl bg-green-500/10 border-2 border-green-500/50 text-center">
            <div className="relative">
              <Award className="w-16 h-16 mx-auto text-amber-500 mb-2" />
              <CheckCircle className="w-8 h-8 absolute top-0 right-1/3 text-green-500 bg-background rounded-full" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-green-500">Certificate Verified!</h1>
            <p className="text-muted-foreground mb-6">
              This is an authentic certificate issued by EduTrack Learning Platform.
            </p>

            <div className="p-4 rounded-xl bg-card border border-border text-left space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Certificate Number</p>
                <p className="font-mono font-bold text-sm">{certificate.certificate_number}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Course Completed</p>
                <p className="font-semibold">{certificate.course_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Score Achieved</p>
                <p className="font-semibold text-green-500">
                  {certificate.score}/10 ({Math.round(certificate.score * 10)}%)
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date of Issue</p>
                <p className="font-medium">
                  {new Date(certificate.issued_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default VerifyCertificate;
