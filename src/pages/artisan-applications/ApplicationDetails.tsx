import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/feedback/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { VerificationPanel } from '@/components/artisan-applications/VerificationPanel'
import { StatusTimeline } from '@/components/artisan-applications/StatusTimeline'
import { ActionPanel } from '@/components/artisan-applications/ActionPanel'
import { ApplicationStatusBadge } from '@/components/artisan-applications/ApplicationStatusBadge'
import { getApplicationById, approveApplication, rejectApplication, requestChanges } from '@/services/artisanApplications.service'
import { format } from 'date-fns'
import { ArrowLeft, MapPin, Mail, Phone, Calendar, Briefcase, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: application, isLoading, error, refetch } = useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplicationById(id!),
    enabled: !!id,
  })

  const approveMutation = useMutation({
    mutationFn: (payload: any) => approveApplication(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] })
      queryClient.invalidateQueries({ queryKey: ['artisan-applications'] })
      queryClient.invalidateQueries({ queryKey: ['application-statistics'] })
      toast.success('Application approved successfully')
    },
    onError: () => {
      toast.error('Failed to approve application')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (payload: any) => rejectApplication(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] })
      queryClient.invalidateQueries({ queryKey: ['artisan-applications'] })
      queryClient.invalidateQueries({ queryKey: ['application-statistics'] })
      toast.success('Application rejected')
    },
    onError: () => {
      toast.error('Failed to reject application')
    },
  })

  const requestChangesMutation = useMutation({
    mutationFn: (payload: any) => requestChanges(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] })
      queryClient.invalidateQueries({ queryKey: ['artisan-applications'] })
      queryClient.invalidateQueries({ queryKey: ['application-statistics'] })
      toast.success('Changes requested successfully')
    },
    onError: () => {
      toast.error('Failed to request changes')
    },
  })

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Application Details"
          description="View and review artisan application details."
          actions={
            <Button variant="outline" onClick={() => navigate('/dashboard/artisan-applications')}>
              <ArrowLeft className="mr-2 size-4" />
              Back to Applications
            </Button>
          }
        />
        <ErrorState
          title="Failed to load application"
          description="There was an error fetching the application details. Please try again."
          onRetry={() => refetch()}
        />
      </PageContainer>
    )
  }

  if (isLoading || !application) {
    return (
      <PageContainer>
        <PageHeader
          title="Application Details"
          description="View and review artisan application details."
          actions={
            <Button variant="outline" onClick={() => navigate('/dashboard/artisan-applications')}>
              <ArrowLeft className="mr-2 size-4" />
              Back to Applications
            </Button>
          }
        />
        <div className="space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </PageContainer>
    )
  }

  const { personalInformation, businessInformation, skills, categories, pricing, portfolio, studentVerification, status, statusHistory } = application

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <PageContainer>
      <PageHeader
        title="Application Details"
        description="View and review artisan application details."
        actions={
          <Button variant="outline" onClick={() => navigate('/dashboard/artisan-applications')}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Applications
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="size-20">
                  {personalInformation.profilePhoto ? (
                    <AvatarImage src={personalInformation.profilePhoto} alt={`${personalInformation.firstName} ${personalInformation.lastName}`} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(personalInformation.firstName, personalInformation.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {personalInformation.firstName} {personalInformation.lastName}
                  </h3>
                  <p className="text-muted-foreground">{personalInformation.email}</p>
                  <div className="mt-2">
                    <ApplicationStatusBadge status={status} />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{personalInformation.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{personalInformation.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{personalInformation.city}, {personalInformation.state}, {personalInformation.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>DOB: {format(new Date(personalInformation.dateOfBirth), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">{businessInformation.businessName}</h4>
                <p className="text-muted-foreground">{businessInformation.businessDescription}</p>
              </div>

              <div className="grid gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-4 text-muted-foreground" />
                  <span>{businessInformation.yearsOfExperience} years of experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Business Type:</span>
                  <span>{businessInformation.businessType}</span>
                </div>
                {businessInformation.taxId && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Tax ID:</span>
                    <span>{businessInformation.taxId}</span>
                  </div>
                )}
                {businessInformation.registrationNumber && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Registration #:</span>
                    <span>{businessInformation.registrationNumber}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill.id} variant="outline" className="capitalize">
                    {skill.name} ({skill.proficiency})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-muted-foreground" />
                <span className="text-2xl font-bold">${pricing.hourlyRate}/hour</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Minimum booking: {pricing.minimumBookingHours} hours</p>
                <p>Available for travel: {pricing.availableForTravel ? 'Yes' : 'No'}</p>
                {pricing.availableForTravel && pricing.travelRadius && (
                  <p>Travel radius: {pricing.travelRadius} km</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.map((item) => (
                  <div key={item.id} className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-2 flex gap-2">
                      {item.images.slice(0, 3).map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`${item.title} ${idx + 1}`}
                          className="size-20 object-cover rounded"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Completed: {format(new Date(item.completedDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verification Panel */}
          <VerificationPanel verification={studentVerification} />

          {/* Status Timeline */}
          <StatusTimeline history={statusHistory} />
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          <ActionPanel
            applicationId={application.id}
            currentStatus={status}
            onApprove={(_, payload) => approveMutation.mutate(payload)}
            onReject={(_, payload) => rejectMutation.mutate(payload)}
            onRequestChanges={(_, payload) => requestChangesMutation.mutate(payload)}
            isLoading={approveMutation.isPending || rejectMutation.isPending || requestChangesMutation.isPending}
          />
        </div>
      </div>
    </PageContainer>
  )
}
